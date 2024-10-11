import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { API_DESCRIPTION, API_TITLE, API_VERSION } from "../constants";

export function setupSwagger(app: INestApplication) {
  const swaggerOptions = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .addServer("http://localhost:4000", "Development server")
    .addServer("https://cfbf79l9f4.execute-api.eu-west-3.amazonaws.com/staging", "Staging server")
    .addBearerAuth({ scheme: "Bearer", type: "http" })
    .setVersion(API_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions, {});
  SwaggerModule.setup("api/docs", app, document);
}