import { useState } from "react";
import { z } from "zod";

type ZodObjectType = ReturnType<typeof z.object>;

type InputProps = {
  name: string;
  value: string;
  id: string;
};
type Inputs = Record<string, InputProps>;

type InputErrors = {
  name?: string[];
  description?: string[];
  notes?: string[];
};

type InputName = keyof InputErrors;

const createInitialInputObjectFromSchema = (
  validationSchema: ZodObjectType
) => {
  const validationSchemaKeys = Object.keys(validationSchema.shape);

  const inputsInitial = validationSchemaKeys.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: { name: curr, value: "", id: curr },
    };
  }, {} as Inputs);

  return inputsInitial;
};

export default function useValiForm(validationSchema: ZodObjectType) {
  const inputsInitial = createInitialInputObjectFromSchema(validationSchema);

  const [inputFields, setInputFields] = useState(inputsInitial);
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
    const inputName: InputName = event.target.name as InputName;
    setInputFields((prevInputs) => ({
      ...prevInputs,
      [inputName]: { ...prevInputs[inputName], value: inputValue },
    }));

    const validationResult = validationSchema.safeParse({
      ...inputFields,
      [inputName]: { ...inputFields[inputName], value: inputValue },
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

  const register = (key: string) => {
    return { ...inputFields[key], onChange: handleInputChange };
  };

  const inputReset = () => {
    setInputErrors(undefined);
    setInputFields(inputsInitial);
    setStatus(undefined);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    onSubmitRequest: () => Promise<Response>
  ) => {
    event.preventDefault();
    const validationResult = validationSchema.safeParse(inputFields);
    if (!validationResult.success) {
      const zodErrorMessages = validationResult.error.flatten().fieldErrors;
      setInputErrors(zodErrorMessages);
      return;
    }

    setStatus("loading");

    const response = await onSubmitRequest();

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
    }
  };

  return {
    register,
    inputs: inputFields,
    inputErrors,
    handleSubmit,
    inputReset,
    status,
  };
}
