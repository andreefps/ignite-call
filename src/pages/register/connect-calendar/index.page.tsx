import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight } from 'phosphor-react'
import { ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'

export default function Register() {
  //async function handleRegister(data) {}

  return (
    <Container>
      <Header>
        <Heading as='strong'>Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>
        <MultiStep currentStep={2} size={4} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => signIn('google')}
          >
            Conectar
            <ArrowRight />
          </Button>
        </ConnectItem>
        <Button type='submit'>
          Proximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
