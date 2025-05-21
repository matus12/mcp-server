import { z } from "zod";

// Define a reusable reference object schema
const referenceObjectSchema = z.object({
  id: z.string().optional(),
  codename: z.string().optional(),
});

// Common property schemas
const baseElementSchema = {
  codename: z.string().optional(),
  external_id: z.string().optional(),
  content_group: referenceObjectSchema
    .describe("An object with an id or codename property referencing a content group.")
    .optional(),
};

const namedElementSchema = {
  ...baseElementSchema,
  name: z.string(),
  guidelines: z.string().optional(),
  is_required: z.boolean().optional(),
  is_non_localizable: z.boolean().optional(),
};

// Limit schemas
const conditionEnum = z.enum(['at_most', 'exactly', 'at_least']);

const countLimitSchema = z.object({
  value: z.number(),
  condition: conditionEnum
}).optional();

const imageLimitSchema = {
  image_width_limit: z.object({
    value: z.number(),
    condition: conditionEnum
  }).optional(),
  image_height_limit: z.object({
    value: z.number(),
    condition: conditionEnum
  }).optional(),
};

// Default value schemas
const arrayDefaultSchema = (schema = referenceObjectSchema) => z.object({
  global: z.object({
    value: z.array(schema)
  })
}).optional();

const stringDefaultSchema = z.object({
  global: z.object({
    value: z.string()
  })
}).optional();

const numberDefaultSchema = z.object({
  global: z.object({
    value: z.number()
  })
}).optional();

// Regex validation schema
const regexValidationSchema = z.object({
  is_active: z.boolean(),
  regex: z.string(),
  flags: z.string().optional(),
  validation_message: z.string().optional()
}).optional();

// Text length limit schema
const textLengthLimitSchema = z.object({
  value: z.number(),
  applies_to: z.enum(['words', 'characters'])
}).optional();

// Individual element type schemas
const assetElementSchema = z.object({
  type: z.literal('asset'),
  ...namedElementSchema,
  asset_count_limit: countLimitSchema,
  maximum_file_size: z.number().optional(),
  allowed_file_types: z.enum(['adjustable', 'any']).optional(),
  ...imageLimitSchema,
  default: arrayDefaultSchema(),
});

const customElementSchema = z.object({
  type: z.literal('custom'),
  ...namedElementSchema,
  source_url: z.string(),
  json_parameters: z.string().optional(),
  allowed_elements: z.array(
    referenceObjectSchema
      .describe("An object with an id or codename property referencing an element.")
  ).optional(),
});

const dateTimeElementSchema = z.object({
  type: z.literal('date_time'),
  ...namedElementSchema,
  default: stringDefaultSchema,
});

const guidelinesElementSchema = z.object({
  type: z.literal('guidelines'),
  guidelines: z.string(),
  ...baseElementSchema,
});

const modularContentElementSchema = z.object({
  type: z.literal('modular_content'),
  ...namedElementSchema,
  allowed_content_types: z.array(
    referenceObjectSchema
      .describe("An object with an id or codename property referencing a content type.")
  ).optional(),
  item_count_limit: countLimitSchema,
  default: arrayDefaultSchema(),
});

const subpagesElementSchema = z.object({
  type: z.literal('subpages'),
  ...namedElementSchema,
  allowed_content_types: z.array(
    referenceObjectSchema
      .describe("An object with an id or codename property referencing a content type.")
  ).optional(),
  item_count_limit: countLimitSchema,
});

const multipleChoiceElementSchema = z.object({
  type: z.literal('multiple_choice'),
  ...namedElementSchema,
  mode: z.enum(['single', 'multiple']),
  options: z.array(z.object({
    name: z.string(),
    codename: z.string().optional(),
    external_id: z.string().optional(),
  })),
  default: arrayDefaultSchema(),
});

const numberElementSchema = z.object({
  type: z.literal('number'),
  ...namedElementSchema,
  default: numberDefaultSchema,
});

const richTextElementSchema = z.object({
  type: z.literal('rich_text'),
  ...namedElementSchema,
  allowed_blocks: z.array(z.enum(['images', 'text', 'tables', 'components-and-items'])).optional(),
  allowed_formatting: z.array(z.enum(['unstyled', 'bold', 'italic', 'code', 'link', 'subscript', 'superscript'])).optional(),
  allowed_text_blocks: z.array(z.enum(['paragraph', 'heading-one', 'heading-two', 'heading-three', 'heading-four', 'heading-five', 'heading-six', 'ordered-list', 'unordered-list'])).optional(),
  allowed_table_blocks: z.array(z.enum(['images', 'text'])).optional(),
  allowed_table_formatting: z.array(z.enum(['unstyled', 'bold', 'italic', 'code', 'link', 'subscript', 'superscript'])).optional(),
  allowed_table_text_blocks: z.array(z.enum(['paragraph', 'heading-one', 'heading-two', 'heading-three', 'heading-four', 'heading-five', 'heading-six', 'ordered-list', 'unordered-list'])).optional(),
  allowed_content_types: z.array(
    referenceObjectSchema
      .describe("An object with an id or codename property referencing a content type.")
  ).optional(),
  allowed_item_link_types: z.array(
    referenceObjectSchema
      .describe("An object with an id or codename property referencing a content type.")
  ).optional(),
  ...imageLimitSchema,
  allowed_image_types: z.enum(['adjustable', 'any']).optional(),
  maximum_image_size: z.number().optional(),
  maximum_text_length: textLengthLimitSchema,
});

const snippetElement = z.object({
  type: z.literal('snippet'),
  snippet: referenceObjectSchema
    .describe("An object with an id or codename property referencing a snippet."),
  ...baseElementSchema,
});

const taxonomyElementSchema = z.object({
  type: z.literal('taxonomy'),
  taxonomy_group: referenceObjectSchema
    .describe("An object with an id or codename property referencing a taxonomy group."),
  ...namedElementSchema,
  term_count_limit: countLimitSchema,
  default: arrayDefaultSchema(),
});

const textElementSchema = z.object({
  type: z.literal('text'),
  ...namedElementSchema,
  maximum_text_length: textLengthLimitSchema,
  validation_regex: regexValidationSchema,
  default: stringDefaultSchema,
});

const urlSlugElementSchema = z.object({
  type: z.literal('url_slug'),
  ...namedElementSchema,
  depends_on: z.object({
    element: referenceObjectSchema
      .describe("An object with an id or codename property referencing an element."),
    snippet: referenceObjectSchema
      .describe("An object with an id or codename property referencing a content type snippet.")
      .optional(),
  }),
  validation_regex: regexValidationSchema,
});

// Define a union type of all possible element types for content types
export const elementSchema = z.union([
  assetElementSchema,
  customElementSchema,
  dateTimeElementSchema,
  guidelinesElementSchema,
  modularContentElementSchema,
  subpagesElementSchema,
  multipleChoiceElementSchema,
  numberElementSchema,
  richTextElementSchema,
  snippetElement,
  taxonomyElementSchema,
  textElementSchema,
  urlSlugElementSchema,
]);

// Define schema for content groups
export const contentGroupSchema = z.object({
  name: z.string(),
  external_id: z.string().optional(),
  codename: z.string().optional(),
});

// Define a union type for snippet elements (excluding url_slug and snippet elements)
export const snippetElementSchema = z.union([
  assetElementSchema,
  customElementSchema,
  dateTimeElementSchema,
  guidelinesElementSchema,
  modularContentElementSchema,
  subpagesElementSchema,
  multipleChoiceElementSchema,
  numberElementSchema,
  richTextElementSchema,
  taxonomyElementSchema,
  textElementSchema,
]); 