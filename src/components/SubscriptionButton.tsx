"use client";
import React from "react";
import axios from "axios";
import { Button } from "./ui/button";


type Props = { isPro: boolean };

const Subscription = ({ isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const handleSubscription = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log("billing error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button className="mt-4" onClick={handleSubscription}  disabled={loading} >
      {isPro ? "Manage Subscriptions" : "Upgrade"}
    </Button>
  );
};

export default Subscription;