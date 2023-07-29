import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "./Button";
import { NewProjectInput } from "../validations/newProjectSchema";

type InputErrors = {
  name?: string[];
  description?: string[];
  notes?: string[];
};

const defaultColorPalette = [
  "hsl(298, 29%, 43%)",
  "hsl(179, 39%, 54%)",
  "hsl(28, 77%, 56%)",
];
const emptyFields = {
  name: "",
  description: "",
  notes: "",
};

const emptyInputCounts = {
  nameCount: 0,
  descriptionCount: 0,
  notesCount: 0,
};

export default function NewProjectModal({
  handleModal,
  isModalOpen,
}: {
  handleModal: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
}) {
  let [colorError, setColorError] = useState<undefined | string>(undefined);
  let [colorPalette, setColorPalette] = useState(defaultColorPalette);
  let [isLoading, setIsLoading] = useState(false);
  let [inputFields, setInputFields] = useState(emptyFields);
  let [inputErrors, setInputErrors] = useState<InputErrors | undefined>(
    undefined
  );
  let [inputCounts, setInputCounts] = useState(emptyInputCounts);

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

    const randomColorPalette: string[] = Object.values(
      responseWithDelay
    ) as string[]; //type assertion as we have strict validation in the backend
    if (!randomColorPalette) {
      setIsLoading(false);
      setColorError(
        "Oops, something went wrong, try again or select the current palette. No worries, you can change it later!"
      );
      return;
    }

    setColorPalette([...randomColorPalette]);
    setColorError(undefined);
    setIsLoading(false);
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    const inputLength = event.target.value.length;
    const inputName = event.target.name;
    setInputCounts((prevCounts) => ({
      ...prevCounts,
      [`${inputName}Count`]: inputLength,
    }));
    setInputFields((prevInputs) => ({
      ...prevInputs,
      [inputName]: inputValue,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement> | undefined
  ): void => {
    if (event) event.preventDefault();
    try {
      NewProjectInput.parse(inputFields);
    } catch (error: any) {
      const zodErrorMessages = error.flatten().fieldErrors;
      setInputErrors(zodErrorMessages);
    }
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          handleModal(false);
          setColorError(undefined);
          setColorPalette([...defaultColorPalette]);
          setInputFields(emptyFields);
          setInputErrors(undefined);
          setInputCounts(emptyInputCounts);
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
                      {inputCounts.nameCount}/50
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
                      {inputCounts.descriptionCount}/200
                    </p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <h3 className="font-medium">
                      Color palette generated by your task buddy:
                    </h3>

                    <div className="flex flex-row self-center">
                      {colorPalette.map((color) => (
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
                        {isLoading ? "generating..." : "generate new palette"}
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
                      {inputCounts.notesCount}/500
                    </p>
                  </div>
                  <div className=" flex flex-row justify-end gap-6 ">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        handleModal(false);
                        setColorError(undefined);
                        setColorPalette([...defaultColorPalette]);
                        setInputFields(emptyFields);
                        setInputErrors(undefined);
                        setInputCounts(emptyInputCounts);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Create Project
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
