import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const RegisterFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode conter apenas letras e hifen',
    })
    .transform((value) => value.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O Nome precisa ter pelo menos 3 letras' }),
})
type RegisterFormData = z.infer<typeof RegisterFormSchema>
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({ resolver: zodResolver(RegisterFormSchema) })
  const router = useRouter()
  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query.username, setValue])

  const handleRegister = (data: RegisterFormData) => {
    console.log(data)
  }
  return (
    <Container>
      <Header>
        <Heading as='strong'>Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois
        </Text>
        <MultiStep currentStep={1} size={4} />
      </Header>
      <Form as='form' onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size='sm'>Nome de usuário</Text>
          <TextInput
            prefix='ignite.com/'
            placeholder='seu-usuario'
            {...register('username')}
          />
          {errors.username && <FormError>{errors.username.message}</FormError>}
        </label>
        <label>
          <Text size='sm'>Nome Completo</Text>
          <TextInput placeholder='Seu Nome' {...register('name')} />
          {errors.name && <FormError>{errors.name.message}</FormError>}
        </label>
        <Button type='submit'>
          Proximo passo <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
