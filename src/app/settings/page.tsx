import Subscription from "@/components/SubscriptionButton";
import { checkSubscription } from "@/lib/subscription";
import React from "react";

type Props = {};

const SettingsPage = async (props: Props) => {
  const isPro = await checkSubscription();
  return (
    <div className="py-8 mx-auto max-w-7xl">
      <h1 className="font-bold text-3xl ">Settings</h1>
      {isPro ? (
        <p className="text-xl text-secondary-foreground/60">
         You are a Subscribed!!
        </p>
      ) : (
        <p className="text-xl text-secondary-foreground/60">
          You are a Free User!!
        </p>
      )}

      <Subscription isPro={isPro} />
    </div>
  );
};

export default SettingsPage;