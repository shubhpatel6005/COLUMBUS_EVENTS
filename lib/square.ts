import { SquareClient, SquareEnvironment } from "square";

let client: SquareClient | null = null;

export function getSquare(): SquareClient {
  if (!client) {
    client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }
  return client;
}
