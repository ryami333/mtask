import styled from "styled-components";

export const Input = styled.input`
  display: block;
  width: 100%;
  appearance: none;
  cursor: pointer;
  border-radius: 2px;
  padding: 8px 8px;
  border: none;
  font-family: "Fira Code";
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 16px;
  line-height: 1.5;
  border: 2px solid transparent;

  &:focus-visible {
    border-color: white;
  }
`;
