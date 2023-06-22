import Navigation from "./navigation";
import { store } from "./store";
import { Provider } from "react-redux";
import "react-native-url-polyfill/auto";
import { BottomTab } from "./navigation";
import { StripeProvider } from "@stripe/stripe-react-native";

const STRIPE_KEY = "STRIPE_KEY ";
export default function App() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <Navigation>
          <BottomTab />
        </Navigation>
      </StripeProvider>
    </Provider>
  );
}
