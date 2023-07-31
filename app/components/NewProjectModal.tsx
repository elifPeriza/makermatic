import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "./Button";
import { NewProjectInput } from "../validations/newProjectSchema";
import { useRouter } from "next/navigation";

type InputErrors = {
  name?: string[];
  description?: string[];
  notes?: string[];
};

type InputName = keyof InputErrors;

type ColorPalette = {
  id?: number;
  colors: string[];
};

const defaultColorPalette = {
  colors: ["hsl(298, 29%, 43%)", "hsl(179, 39%, 54%)", "hsl(28, 77%, 56%)"],
};

const emptyFields = {
  name: "",
  description: "",
  notes: "",
};

export default function NewProjectModal({
  handleModal,
  isModalOpen,
}: {
  handleModal: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
}) {
  const router = useRouter();
  const [colorError, setColorError] = useState<undefined | string>(undefined);
  const [colorPalette, setColorPalette] =
    useState<ColorPalette>(defaultColorPalette);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFields, setInputFields] = useState(emptyFields);
  const [inputErrors, setInputErrors] = useState<InputErrors | undefined>(
    undefined
  );
  const [createProjectStatus, setCreateProjectStatus] = useState<
    "loading" | "success" | "error" | undefined
  >();

  const handleColorPaletteGeneration = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/api/colorpalette").then(
      (response) => response.json()
    );

    const delay = new Promise((resolve) => setTimeout(resolve, 2000));

    const [responseWithDelay] = await Promise.all([response, delay]);

    if (responseWithDelay.error) {
      setIsLoading(false);
      setColorError(response.error);
      return;
    }
    const formattedColors = Object.values(responseWithDelay.colors) as string[]; //type assertion as we have strict validation in the backend

    const randomColorPalette = {
      id: responseWithDelay.id,
      colors: formattedColors,
    };

    if (!randomColorPalette) {
      setIsLoading(false);
      setColorError(
        "Oops, something went wrong, try again or select the current palette. No worries, you can change it later!"
      );
      return;
    }

    setColorPalette(randomColorPalette);
    setColorError(undefined);
    setIsLoading(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    const inputName: InputName = event.target.name as InputName;
    setInputFields((prevInputs) => ({
      ...prevInputs,
      [inputName]: inputValue,
    }));

    const result = NewProjectInput.safeParse({
      ...inputFields,
      [inputName]: inputValue,
    });
    if (inputErrors?.[inputName]) {
      if (result.success) setInputErrors(undefined);
      else {
        const zodErrorMessages = result.error.flatten().fieldErrors;
        setInputErrors(zodErrorMessages);
      }
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement> | undefined
  ) => {
    if (event) event.preventDefault();

    const result = NewProjectInput.safeParse(inputFields);
    if (!result.success) {
      const zodErrorMessages = result.error.flatten().fieldErrors;
      setInputErrors(zodErrorMessages);
      return;
    }
    setCreateProjectStatus("loading");

    const response = await fetch("http://localhost:3000/api/newproject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...inputFields,
        colorPaletteId: colorPalette.id || 1,
        userId: 1,
      }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      setCreateProjectStatus("error");
      const error = responseBody.error;
      console.log(error);
      if (error.type === "zod") {
        setInputErrors(error.zodErrorMessages);
      } else {
        setInputErrors(undefined);
      }
    } else {
      setCreateProjectStatus("success");
    }
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          handleModal(false);
          setColorError(undefined);
          setColorPalette(defaultColorPalette);
          setInputFields(emptyFields);
          setInputErrors(undefined);
          setCreateProjectStatus(undefined);
        }}
        className="relative z-50"
      >
        <div
          data-testid="modalbackdrop"
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel>
            <div className=" w-[90vw] max-w-[700px] rounded-md bg-midblue p-6 sm:p-10">
              <div className="font-sans text-base text-white ">
                <Dialog.Title className="mb-4 text-center font-medium">
                  New Project
                </Dialog.Title>

                {createProjectStatus !== "success" &&
                  createProjectStatus !== "loading" && (
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                      <label className="font-medium" htmlFor="name">
                        Name:
                      </label>
                      <input
                        name="name"
                        value={inputFields.name}
                        onChange={handleInputChange}
                        type="text"
                        id="name"
                        className="mb-1 h-8 rounded-md border border-lightblue bg-darkblue p-2"
                      ></input>
                      <div className="mb-3 flex flex-row justify-between">
                        {inputErrors?.name ? (
                          <p className=" text-lightred">
                            {inputErrors.name.map((error) => error)}
                          </p>
                        ) : (
                          <div></div>
                        )}
                        <p className="self-start text-xs">
                          {inputFields.name.length}/50
                        </p>
                      </div>

                      <label htmlFor="description" className="font-medium">
                        Description (optional):
                      </label>
                      <textarea
                        name="description"
                        value={inputFields.description}
                        id="description"
                        className="mb-1 h-14 min-h-[32px] rounded-md border border-lightblue bg-darkblue p-2"
                        onChange={handleInputChange}
                      ></textarea>
                      <div className="mb-6 flex flex-row justify-between">
                        {inputErrors?.description ? (
                          <p className=" text-lightred">
                            {inputErrors.description.map((error) => error)}
                          </p>
                        ) : (
                          <div></div>
                        )}
                        <p className="self-start text-xs">
                          {inputFields.description.length}/200
                        </p>
                      </div>
                      <div className="flex flex-col gap-6">
                        <h3 className="font-medium">
                          Color palette generated by your task buddy:
                        </h3>

                        <div className="flex flex-row self-center">
                          {colorPalette.colors.map((color) => (
                            <div
                              key={color}
                              className={`h-[24px] w-[24px] rounded-[5px]  ${
                                isLoading ? "animate-hueshift" : ""
                              }`}
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>

                        {colorError && (
                          <p className="max-w-xs self-center text-center text-lightred">
                            {colorError}
                          </p>
                        )}

                        <div className="mb-10 flex flex-row justify-center gap-6">
                          <Button
                            onClick={handleColorPaletteGeneration}
                            variant="primary"
                            disabled={isLoading}
                          >
                            {isLoading
                              ? "generating..."
                              : "generate new palette"}
                          </Button>
                        </div>
                      </div>
                      <label htmlFor="notes" className="font-medium">
                        Notes (optional):
                      </label>
                      <textarea
                        name="notes"
                        value={inputFields.notes}
                        id="notes"
                        className="mb-1 h-32 min-h-[32px] rounded-md border border-lightblue bg-darkblue p-2"
                        onChange={handleInputChange}
                      ></textarea>
                      <div className="mb-3 flex flex-row justify-between">
                        {inputErrors?.notes ? (
                          <p className=" text-lightred">
                            {inputErrors.notes.map((error) => error)}
                          </p>
                        ) : (
                          <div></div>
                        )}
                        <p className="self-start text-xs">
                          {inputFields.notes.length}/500
                        </p>
                      </div>
                      {createProjectStatus === "error" && !inputErrors && (
                        <p className="text-lightred">
                          Something went wrong, try again!
                        </p>
                      )}

                      <div className=" flex flex-row justify-end gap-6 ">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            handleModal(false);
                            setColorError(undefined);
                            setColorPalette(defaultColorPalette);
                            setInputFields(emptyFields);
                            setInputErrors(undefined);
                            setCreateProjectStatus(undefined);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                          Create Project
                        </Button>
                      </div>
                    </form>
                  )}
                {createProjectStatus === "loading" && (
                  <p className="text-center">Creating new project...</p>
                )}
                {createProjectStatus === "success" && (
                  <div className="flex flex-col items-center justify-center gap-8">
                    <p className="text-center text-brightgreen">
                      {`Congrats! New project "${inputFields.name}" was created!`}
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => {
                        router.push("/");
                        router.refresh();
                        handleModal(false);
                        setCreateProjectStatus(undefined);
                        setInputFields(emptyFields);
                        setInputErrors(undefined);
                        setColorError(undefined);
                        setColorPalette(defaultColorPalette);
                      }}
                    >
                      Go to Projects
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
