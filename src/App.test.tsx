import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders the <App/> without any error", () => {
  render(<App />);
  expect(screen.getByText(/bordle/i)).toBeInTheDocument();
});
