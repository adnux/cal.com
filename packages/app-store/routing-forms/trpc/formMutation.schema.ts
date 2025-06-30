import z from "zod";

import { fieldSchema } from "@calcom/features/form-builder/schema";
import { RoutingFormSettings } from "@calcom/prisma/zod-utils";

import { zodRoutes } from "../zod";

export const ZFormMutationInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  disabled: z.boolean().optional(),
  fields: z.array(fieldSchema).optional(),
  routes: zodRoutes,
  addFallback: z.boolean().optional(),
  duplicateFrom: z.string().nullable().optional(),
  teamId: z.number().nullish().default(null),
  shouldConnect: z.boolean().optional(),
  settings: RoutingFormSettings.optional(),
});

export type TFormMutationInputSchema = z.infer<typeof ZFormMutationInputSchema>;
