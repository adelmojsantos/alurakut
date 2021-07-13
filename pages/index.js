import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'

function ProfileSidebar(props) {
  return (
    <Box>
      <img src={`https://github.com/${props.gitHubUser}.png`} alt="foto Perfil"
        style={{ borderRadius: '8px' }}
      />
    </Box>
  )
}

export default function Home() {
  const gitHubUser = 'adelmojsantos';
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'felipefialho',
    'Tarcilio-Ba',
    'diegohfcelestino'
  ]
  return (
    <>
      <AlurakutMenu />
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
        </div>
        <div className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((githubUser) => {
                return (
                  <li>
                    <a href={`/users/${githubUser}`} key={githubUser}>
                      <img src={`https://github.com/${githubUser}.png`} />
                      <span>{githubUser}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box>
            Comunidades
          </Box>
        </div>
      </MainGrid>
    </>
  )
}
