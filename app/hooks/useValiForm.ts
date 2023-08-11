import { useState } from "react";
import { z } from "zod";

type InputErrors = Record<string, string[] | undefined>;

export default function useValiForm<
  InputSchema extends z.ZodObject<any>,
  InputType extends Record<string, any>
>(
  validationSchema: InputSchema,
  onSubmitRequest: (values: InputType) => Promise<any> | any,
  initialValues?: Partial<InputType>,
  onSuccess?: () => void
) {
  const [inputs, setInputs] = useState<Partial<InputType>>(initialValues || {});
  const [inputErrors, setInputErrors] = useState<InputErrors | undefined>(
    undefined
  );
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | undefined
  >();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    const inputName = event.target.name;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [inputName]: inputValue,
    }));

    const validationResult = validationSchema.safeParse({
      ...inputs,
      [inputName]: inputValue,
    });

    if (inputErrors?.[inputName]) {
      if (validationResult.success) {
        setInputErrors(undefined);
      } else {
        const zodErrorMessages = validationResult.error.flatten().fieldErrors;

        setInputErrors(zodErrorMessages);
      }
    }
  };

  const register = (key: keyof InputType) => {
    return {
      name: key,
      id: key,
      value: inputs[key],
      onChange: handleInputChange,
    };
  };

  const inputReset = () => {
    setInputErrors(undefined);
    setInputs(initialValues || {});
    setStatus(undefined);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validationSchema.safeParse(inputs);

    if (!validationResult.success) {
      const zodErrorMessages = validationResult.error.flatten().fieldErrors;

      setInputErrors(zodErrorMessages);
      return;
    }

    setStatus("loading");

    const response = await onSubmitRequest(inputs as InputType);

    const responseBody = await response.json();
    if (!response.ok) {
      setStatus("error");
      const error = responseBody.error;
      console.log(error);
      if (error.type === "zod") {
        setInputErrors(error.zodErrorMessages);
      } else {
        setInputErrors(undefined);
      }
    } else {
      setStatus("success");
      onSuccess?.();
    }
  };

  return {
    register,
    inputs,
    inputErrors,
    handleSubmit,
    inputReset,
    status,
  };
}
