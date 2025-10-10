import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "../../components/ThemeProvider";

export function renderwithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      {ui}
      {/* <ThemeProvider>{ui}</ThemeProvider> */}
    </BrowserRouter>
  );
}
