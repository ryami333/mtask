import styled from "styled-components";

export const Button = styled.button`
  unset: all;
  appearance: none;
  cursor: pointer;
  border-radius: 24px;
  padding: 8px 32px;
  font-family: "Fira Code";
  border: 2px solid transparent;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 16px;
  line-height: 1.5;

  &:hover,
  &:focus {
    border-color: white;
  }
`;
