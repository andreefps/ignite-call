import { Box, Text, styled } from '@ignite-ui/react'

export const Form = styled(Box, {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '$2',
  padding: '$4',

  '@media(max-width: 660px)': {
    gridTemplateColumns: '1fr',
  },
})

export const FormAnnotaion = styled('div', {
  marginTop: '$2',
  [`> ${Text}`]: {
    color: '$gray400',
  },
})
