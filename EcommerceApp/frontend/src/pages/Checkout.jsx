import axios from "axios";

await axios.post("/api/v1/orders", {
  user_id: decoded.user_id,
  total,
  status: "pending",
});
