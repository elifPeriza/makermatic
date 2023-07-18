"use client";

import { useState } from "react";
import Button from "./Button";
import Logo from "./Logo";
import { Dialog } from "@headlessui/react";

const colorScheme = [
  { color: "bg-[#87CEEB]" },
  { color: "bg-[#FF7F50]" },
  { color: "bg-[#FFD700]" },
];

export default function Header() {
  let [isOpen, setIsOpen] = useState(true);

  return (
    <header>
      <div className=" mt-5 flex flex-row md:mt-8">
        <Logo />
        <nav className="ml-auto mobile:hidden sm:hidden md:block">
          <Button onClick={() => setIsOpen(true)} variant="primary">
            + new project
          </Button>
        </nav>
        <nav className=" fixed bottom-0 left-0 right-0 z-50 flex h-14 justify-center bg-darkblue  md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className=" z-100 absolute bottom-5 h-14 w-14 self-start rounded-full bg-softgreen font-sans text-3xl "
          >
            +
          </button>
        </nav>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div
          data-testid="modalbackdrop"
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel>
            <div className="w-[90vw] max-w-[700px] rounded-md bg-midblue p-6 sm:p-10">
              <div className="flex flex-col font-sans text-base text-white ">
                <Dialog.Title className="mb-10 self-center font-medium">
                  New Project
                </Dialog.Title>
                <div></div>
                <label className="font-medium" htmlFor="projectName">
                  Project name:
                </label>
                <input
                  type="text"
                  id="projectName"
                  className="mb-6 h-8 rounded-md border border-lightblue bg-darkblue p-2"
                ></input>
                <div className="mt-4 flex flex-col gap-6">
                  <h3 className="font-medium">
                    Color scheme generated by your task buddy:
                  </h3>
                  <div className="flex flex-row self-center">
                    {colorScheme.map(({ color }) => (
                      <div
                        className={`h-[24px] w-[24px] rounded-[5px] ${color}`}
                      ></div>
                    ))}
                  </div>

                  <div className="mb-10 flex flex-row justify-center gap-6">
                    <Button variant="primary">generate new scheme</Button>
                    <Button variant="secondary">Undo</Button>
                  </div>
                </div>

                <label htmlFor="projectNotes" className="font-medium">
                  Notes:
                </label>
                <textarea
                  id="projectNotes"
                  className="mb-10 h-40 min-h-[32px] rounded-md border border-lightblue bg-darkblue p-2"
                ></textarea>
              </div>
              <div className=" flex flex-row justify-end gap-6 ">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary">Create Project</Button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </header>
  );
}
