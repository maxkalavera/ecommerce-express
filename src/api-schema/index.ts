import { OpenAPISchemaBuilder } from "./utils";
import { productsModel } from "@/models/products";

export const openAPISchema = new OpenAPISchemaBuilder({
  openapi: "3.0.1",
  info: {
    title: "OpenAPI",
    version: "1.0.0",
    description: "OpenAPI documentation",
  },
  servers: [
    {
      url: "http://localhost:3001/api/",
      description: "Development server",
    }    
  ],
  paths: {},
  components: {
    schemas: {},
  },
});

openAPISchema
  .addCreateActionResource("products", productsModel.schemas.insert, productsModel.schemas.select)
  .addReadActionResource("products", productsModel.schemas.select)
  .addListActionResource("products", productsModel.schemas.select)
  .addUpdateActionResource("products", productsModel.schemas.update, productsModel.schemas.select)
  .addDeleteActionResource("products", productsModel.schemas.select);
