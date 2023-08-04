import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "./Button";
import {
  NewProjectInput,
  NewProjectInputType,
  NewProjectSchema,
} from "../validations/newProjectSchema";
import { useRouter } from "next/navigation";
import useValiForm from "../hooks/useValiForm";

type ColorPalette = {
  id?: number;
  colors: string[];
};

const defaultColorPalette = {
  colors: ["hsl(298, 29%, 43%)", "hsl(179, 39%, 54%)", "hsl(28, 77%, 56%)"],
};

const createNewProject = (
  inputs: NewProjectInputType,
  colorPalette: ColorPalette
) => {
  return fetch("http://localhost:3000/api/newproject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...inputs,
      colorPaletteId: colorPalette.id || 1,
      userId: 1,
    }),
  });
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
  const [isGeneratingPalette, setIsGeneratingPalette] = useState(false);

  const { register, inputs, inputErrors, inputReset, handleSubmit, status } =
    useValiForm<NewProjectSchema, NewProjectInputType>(
      NewProjectInput,
      (inputs) => createNewProject(inputs, colorPalette)
    );
  const handleColorPaletteGeneration = async () => {
    setIsGeneratingPalette(true);
    const response = await fetch("http://localhost:3000/api/colorpalette").then(
      (response) => response.json()
    );

    const delay = new Promise((resolve) => setTimeout(resolve, 2000));

    const [responseWithDelay] = await Promise.all([response, delay]);

    if (responseWithDelay.error) {
      setIsGeneratingPalette(false);
      setColorError(response.error);
      return;
    }
    const formattedColors = Object.values(responseWithDelay.colors) as string[]; //type assertion as we have strict validation in the backend

    const randomColorPalette = {
      id: responseWithDelay.id,
      colors: formattedColors,
    };

    if (!randomColorPalette) {
      setIsGeneratingPalette(false);
      setColorError(
        "Oops, something went wrong, try again or select the current palette. No worries, you can change it later!"
      );
      return;
    }

    setColorPalette(randomColorPalette);
    setColorError(undefined);
    setIsGeneratingPalette(false);
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          handleModal(false);
          setColorError(undefined);
          setColorPalette(defaultColorPalette);
          inputReset();
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

                {status !== "success" && status !== "loading" && (
                  <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label className="font-medium" htmlFor="name">
                      Name:
                    </label>
                    <input
                      {...register("name")}
                      type="text"
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
                      <p className=" ml-4 self-start text-xs">
                        {inputs.name.length}/50
                      </p>
                    </div>

                    <label htmlFor="description" className="font-medium">
                      Description (optional):
                    </label>
                    <textarea
                      {...register("description")}
                      className="mb-1 h-14 min-h-[32px] rounded-md border border-lightblue bg-darkblue p-2"
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
                        {inputs.description?.length ?? 0}/200
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
                              isGeneratingPalette ? "animate-hueshift" : ""
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
                          disabled={isGeneratingPalette}
                        >
                          {isGeneratingPalette
                            ? "generating..."
                            : "generate new palette"}
                        </Button>
                      </div>
                    </div>
                    <label htmlFor="notes" className="font-medium">
                      Notes (optional):
                    </label>
                    <textarea
                      {...register("notes")}
                      className="mb-1 h-32 min-h-[32px] rounded-md border border-lightblue bg-darkblue p-2"
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
                        {inputs.notes?.length ?? 0}/500
                      </p>
                    </div>
                    {status === "error" && !inputErrors && (
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
                          inputReset();
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
                {status === "loading" && (
                  <p className="text-center">Creating new project...</p>
                )}
                {status === "success" && (
                  <div className="flex flex-col items-center justify-center gap-8">
                    <p className="text-center text-brightgreen">
                      {`Congrats! New project "${inputs.name}" was created!`}
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => {
                        router.push("/");
                        router.refresh();
                        handleModal(false);
                        setColorError(undefined);
                        setColorPalette(defaultColorPalette);
                        inputReset();
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
