import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react"
import { Container, Header } from "../styles"
import { ArrowRight, Check } from "phosphor-react"
import { AuthError, ConnectBox, ConnectItem } from "./styles"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function Register() {
  //async function handleRegister(data) {}
  const router = useRouter()
  const session = useSession()
  const hasAuthError = !!router.query.error
  const hasSignedIn = session.status === "authenticated"
  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>
        <MultiStep currentStep={2} size={4} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {!hasSignedIn ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signIn("google")}
            >
              Conectar
              <ArrowRight />
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              Conectado
              <Check size={"sm"} />
            </Button>
          )}
        </ConnectItem>
        {hasAuthError && (
          <AuthError size={"sm"}>
            Falha ao se conectar ao Google, verifique se voce habilitou as
            permissoes ao Google Calendar{" "}
          </AuthError>
        )}
        <Button variant={"primary"} type="submit" disabled={!hasSignedIn}>
          Proximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
