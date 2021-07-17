import { useEffect, useState } from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken'

import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';

import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.gitHubUser}.png`} alt="foto Perfil"
        style={{ borderRadius: '8px' }}
      />
      <hr />

      <p>
        <a className="boxLink" href={`http://github.com/${props.gitHubUser}`}>
          @{props.gitHubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationBox({ title, items }) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} ({items.length})
      </h2>
      <ul>
        {items.map((itemAtual, index) => {
          return (
            <li key={index}>
              <a href={`https://github.com/${itemAtual.login}`} >
                <img src={`https://github.com/${itemAtual.login}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Home(props) {
  const [comunidades, setComunidades] = useState([])
  const [seguidores, setSeguidores] = useState([])
  const gitHubUser = props.githubUser;
  const [pessoasFavoritas, setPessoasFavoritas] = useState([])

  useEffect(() => {
    fetch(`https://api.github.com/users/${gitHubUser}/followers`)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta)
      })

    fetch(`https://api.github.com/users/${gitHubUser}/following`)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setPessoasFavoritas(respostaCompleta)
      })

    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '9682ae5a512b779928ae3034f3065a',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
        allCommunities{
          title
          id
          imageUrl
          creatorSlug
        }
      }`})
    })
      .then(response => response.json())
      .then(respostaCompleta => {
        setComunidades(respostaCompleta.data.allCommunities)
      })
  }, [])

  function handleCriaComunidade(e) {
    e.preventDefault();

    const dadosDoForm = new FormData(e.target)

    const comunidade = {
      title: dadosDoForm.get('title'),
      imageUrl: dadosDoForm.get('image'),
      creatorSlug: gitHubUser,
    }

    fetch('/api/communities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunidade)
    })
      .then(async (response) => {
        const dados = await response.json();
        console.log(dados.registroCriado);
        const comunidade = dados.registroCriado;
        const comunidadesAtualizada = [...comunidades, comunidade]
        setComunidades(comunidadesAtualizada)
      })
  }

  return (
    <>
      <AlurakutMenu githubUser={gitHubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar gitHubUser={gitHubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem Vindo(a)

              <OrkutNostalgicIconSet />
            </h1>
          </Box>

          <Box>
            <h2 className="subTitle" >O que você deseja fazer?</h2>
            <form onSubmit={e => handleCriaComunidade(e)} >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationBox title="Seguidores" items={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/comunidades/${itemAtual.id}`} >
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((githubUser, index) => {
                return (
                  <li key={index}>
                    <a href={`https://github.com/${githubUser.login}`} >
                      <img src={`https://github.com/${githubUser.login}.png`} />
                      <span>{githubUser.login}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
    .then((resposta) => resposta.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser
    }
  }
}
