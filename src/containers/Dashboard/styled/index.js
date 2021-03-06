import styled from "styled-components";

export const Flex = styled.div`
    width: 100%;
    display: flex;
    justify-content: ${props => props.right ? 'flex-end' : ''};
`

export const H2 = styled.h2`
  margin: 0;
`