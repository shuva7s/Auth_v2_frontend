"use client";

import { useState } from "react";
import SignupForm from "./SignupForm";
import VerifySignUp from "./VerifySignUp";
import Cookies from "js-cookie";

const ViewController = () => {
	const cookieVal = Cookies.get("signup_pending");
	const [pendingCookie, setPendingCookie] = useState<string | undefined>(
		cookieVal
	);

	if (pendingCookie) {
		return <VerifySignUp />;
	} else {
		return <SignupForm setPendingCookie={setPendingCookie} />;
	}
};

export default ViewController;
