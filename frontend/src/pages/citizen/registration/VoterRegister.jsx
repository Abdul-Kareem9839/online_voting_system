import { useState } from "react";
import IdentityStep from "./IdentityStep";
import ElectionStep from "./ElectionStep";
import OtpStep from "./OtpStep";
import FaceRegistrationStep from "./FaceRegistrationStep";
import RegistrationSuccessStep from "./RegistrationSuccessStep";

export default function Register() {
  const [step, setStep] = useState("identity");
  const [errorMsg, setErrorMsg] = useState("");

  const [registrationData, setRegistrationData] = useState({
    email: "",
    voter_id_number: "",

    voter_id: null,
    election_id: null,
    election_name: "",

    otp: "",

    face_registered: false,
  });

  const updateRegistrationData = (newData) => {
    setRegistrationData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const nextStep = () => {
    switch (step) {
      case "identity":
        setStep("election");
        break;

      case "election":
        setStep("otp");
        break;

      case "otp":
        if (registrationData.face_registered) {
          setStep("success");
        } else {
          setStep("face");
        }
        break;

      case "face":
        setStep("success");
        break;

      default:
        break;
    }
  };

  const previousStep = () => {
    switch (step) {
      case "election":
        setStep("identity");
        break;

      case "otp":
        setStep("election");
        break;

      case "face":
        setStep("otp");
        break;

      default:
        break;
    }
  };

  return (
    <>
      {step === "identity" && (
        <IdentityStep
          data={registrationData}
          updateData={updateRegistrationData}
          next={nextStep}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      )}

      {step === "election" && (
        <ElectionStep
          data={registrationData}
          updateData={updateRegistrationData}
          next={nextStep}
          back={previousStep}
        />
      )}

      {step === "otp" && (
        <OtpStep
          data={registrationData}
          updateData={updateRegistrationData}
          next={nextStep}
          back={previousStep}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      )}

      {step === "face" && (
        <FaceRegistrationStep
          formData={registrationData}
          next={nextStep}
          back={previousStep}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      )}

      {step === "success" && (
        <RegistrationSuccessStep data={registrationData} />
      )}
    </>
  );
}
