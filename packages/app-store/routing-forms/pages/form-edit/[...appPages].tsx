"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Toaster } from "sonner";
import type { z } from "zod";

import { FormFieldList, FormFieldDialog } from "@calcom/features/form-builder/FormBuilder";
import type { fieldSchema, fieldsSchema } from "@calcom/features/form-builder/schema";
import classNames from "@calcom/ui/classNames";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";

import type { inferSSRProps } from "@lib/types/inferSSRProps";

import SingleForm from "../../components/SingleForm";
import type { getServerSidePropsForSingleFormView as getServerSideProps } from "../../components/getServerSidePropsSingleForm";
import type { RoutingFormWithResponseCount } from "../../types/types";

type BookingField = z.infer<typeof fieldSchema>;
type HookForm = UseFormReturn<RoutingFormWithResponseCount>;
type RhfForm = {
  fields: z.infer<typeof fieldsSchema>;
};

type RhfFormFields = RhfForm["fields"];

type RhfFormField = RhfFormFields[number] & { id?: string };

const FormEdit = ({
  hookForm,
  form,
  appUrl,
}: {
  hookForm: HookForm;
  form: inferSSRProps<typeof getServerSideProps>["form"];
  appUrl: string;
}) => {
  const fieldsNamespace = "fields";
  const { fields, append, remove, swap, update } = useFieldArray({
    control: hookForm.control,
    name: fieldsNamespace as unknown as "fields",
    keyName: "_id",
  });
  const [animationRef] = useAutoAnimate<HTMLDivElement>();

  //
  const [fieldDialog, setFieldDialog] = useState({
    isOpen: false,
    fieldIndex: -1,
    data: {} as RhfFormField | null,
  });
  //
  const addField = () => {
    setFieldDialog({
      isOpen: true,
      fieldIndex: -1,
      data: null,
    });
  };

  const editField = (index: number, data: RhfFormField) => {
    setFieldDialog({
      isOpen: true,
      fieldIndex: index,
      data,
    });
  };

  const removeField = (index: number) => {
    remove(index);
  };

  // hookForm.reset(form);
  if (!form.fields) {
    form.fields = [];
  }

  return (
    <div ref={animationRef} className="flex w-full flex-col rounded-md">
      <FormFieldDialog
        fieldDialog={fieldDialog}
        setFieldDialog={setFieldDialog}
        fields={fields}
        append={append}
        update={update}
        shouldConsiderRequired={(field: BookingField) => {
          // Location field has a default value at backend so API can send no location but we don't allow it in UI and thus we want to show it as required to user
          return field.name === "location" ? true : field.required;
        }}
        isRoutingForm
      />
      {fields?.length ? (
        <div className="w-full py-4 lg:py-8">
          <FormFieldList
            fields={fields}
            swap={swap}
            update={update}
            editField={editField}
            removeField={removeField}
            hookForm={hookForm}
            hookFieldNamespace={fieldsNamespace}
          />
          {fields.length ? (
            <div className={classNames("flex")}>
              <Button
                data-testid="add-field"
                type="button"
                StartIcon="plus"
                color="secondary"
                onClick={addField}>
                Add question
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="w-full py-4 lg:py-8">
          {/* TODO: remake empty screen for V3 */}
          <div className="border-sublte bg-muted flex flex-col items-center gap-6 rounded-xl border p-11">
            <div className="mb-3 grid">
              {/* Icon card - Top */}
              <div className="bg-default border-subtle z-30 col-start-1 col-end-1 row-start-1 row-end-1 h-10 w-10 transform rounded-md border shadow-sm">
                <div className="text-emphasis flex h-full items-center justify-center">
                  <Icon name="menu" className="text-emphasis h-4 w-4" />
                </div>
              </div>
              {/* Left fanned card */}
              <div
                className="bg-default border-subtle z-20 col-start-1 col-end-1 row-start-1 row-end-1 h-10 w-10 rounded-md border shadow-sm"
                style={{
                  transform: "translate(-12px, 2px) rotate(-6deg)",
                }}
              />
              {/* Right fanned card */}
              <div
                className="bg-default border-subtle z-10 col-start-1 col-end-1 row-start-1 row-end-1 h-10 w-10 rounded-md border shadow-sm"
                style={{
                  transform: "translate(12px, 2px) rotate(6deg)",
                }}
              />
            </div>
            <div>
              <h1 className="text-emphasis text-emphasis text-center text-lg font-semibold">
                Create your first question
              </h1>
              <p className="text-default mt-2 text-center text-sm leading-normal">
                Fields are the form fields that the booker would see.
              </p>
            </div>
            <Button data-testid="add-field" onClick={addField} StartIcon="plus" className="mt-6">
              Add question
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function FormEditPage({
  appUrl,
  ...props
}: inferSSRProps<typeof getServerSideProps> & { appUrl: string }) {
  const [fieldDialog, setFieldDialog] = useState({
    isOpen: false,
    fieldIndex: -1,
    data: {} as RhfFormField | null,
  });

  return (
    <>
      <Toaster position="bottom-right" />
      <SingleForm
        {...props}
        appUrl={appUrl}
        Page={({ hookForm, form }) => <FormEdit appUrl={appUrl} hookForm={hookForm} form={form} />}
      />
    </>
  );
}
