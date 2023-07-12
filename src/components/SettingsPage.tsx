import React, { MouseEventHandler, useId } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as createUuid } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppState } from "../helpers/AppStateContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  height: -webkit-fill-available;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin: 0;
  padding: 0;
`;

const Th = styled.th`
  text-align: left;
`;

const Field = styled.div``;

const Label = styled.label``;

const validationSchema = z.object({
  prefix: z.string().nonempty(),
  color: z.string().nonempty(),
});

type FormValues = z.infer<typeof validationSchema>;

export const SettingsPage = ({
  onClickBack,
}: {
  onClickBack: MouseEventHandler;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      prefix: "",
      color: "#FF0000",
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (formValues: FormValues) => {
    window.appState.setState((current) => ({
      colors: [
        ...current.colors,
        {
          uuid: createUuid(),
          ...formValues,
        },
      ],
    }));
    reset();
  };

  const prefixInputId = useId();
  const colorInputId = useId();

  const appState = useAppState();

  const removeColorMapping = (uuid: string) => {
    window.appState.setState((current) => ({
      colors: current.colors.filter(
        (colorMapping) => colorMapping.uuid !== uuid
      ),
    }));
  };

  return (
    <Container>
      <Button onClick={onClickBack}>⏎ Back</Button>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <Label htmlFor={prefixInputId}>Prefix</Label>
          <Input id={prefixInputId} type="text" {...register("prefix")} />
        </Field>
        <Field>
          <Label htmlFor={colorInputId}>Color</Label>
          <Input id={colorInputId} type="text" {...register("color")} />
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
      <table>
        <thead>
          <tr>
            <Th>Prefix</Th>
            <Th>Color</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {appState.colors.map((colorMapping) => (
            <tr key={colorMapping.uuid} style={{ color: colorMapping.color }}>
              <td>{colorMapping.prefix}</td>
              <td>{colorMapping.color}</td>
              <td>
                <Button onClick={() => removeColorMapping(colorMapping.uuid)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};
