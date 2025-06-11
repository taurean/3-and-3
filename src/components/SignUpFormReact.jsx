import { useState } from "react";

import styles from "./SignUpFormReact.module.css";

const INIT = "INIT";
const SUBMITTING = "SUBMITTING";
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";
const formStates = [INIT, SUBMITTING, ERROR, SUCCESS];
const formStyles = {
    id: "cm6k853p100v07ut3kgvt0jh0",
    name: "Default",
    formStyle: "inline",
    placeholderText: "you@example.com",
    formFont: "Inter",
    formFontColor: "#000000",
    formFontSizePx: 14,
    buttonText: "Join Waitlist",
    buttonFont: "Inter",
    buttonFontColor: "#ffffff",
    buttonColor: "#0D9488",
    buttonFontSizePx: 14,
    successMessage: "you're in! we can't wait to share more.",
    successFont: "Inter",
    successFontColor: "#000000",
    successFontSizePx: 14,
    userGroup: "",
};
const domain = "app.loops.so";

function isValidEmail(email) {
    return /.+@.+/.test(email);
}

export default function SignUpFormReact() {
    const [email, setEmail] = useState("");
    const [formState, setFormState] = useState(INIT);
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({});

    const resetForm = () => {
        setEmail("");
        setFormState(INIT);
        setErrorMessage("");
    };

    /**
     * Rate limit the number of submissions allowed
     * @returns {boolean} true if the form has been successfully submitted in the past minute
     */
    const hasRecentSubmission = () => {
        const time = new Date();
        const timestamp = time.valueOf();
        const previousTimestamp = localStorage.getItem("loops-form-timestamp");

        // Indicate if the last sign up was less than a minute ago
        if (
            previousTimestamp &&
            Number(previousTimestamp) + 60 * 1000 > timestamp
        ) {
            setFormState(ERROR);
            setErrorMessage(
                "Too many signups, please try again in a little while",
            );
            return true;
        }

        localStorage.setItem("loops-form-timestamp", timestamp.toString());
        return false;
    };

    const handleSubmit = (event) => {
        // Prevent the default form submission
        event.preventDefault();

        // boundary conditions for submission
        if (formState !== INIT) return;
        if (!isValidEmail(email)) {
            setFormState(ERROR);
            setErrorMessage("Please enter a valid email");
            return;
        }
        if (hasRecentSubmission()) return;
        setFormState(SUBMITTING);

        // build additional fields
        const additionalFields = Object.entries(fields).reduce(
            (acc, [key, val]) => {
                if (val) {
                    return acc + "&" + key + "=" + encodeURIComponent(val);
                }
                return acc;
            },
            "",
        );

        // build body
        const formBody = `userGroup=${encodeURIComponent(
            formStyles.userGroup,
        )}&email=${encodeURIComponent(email)}&mailingLists=`;

        // API request to add user to newsletter
        fetch(`https://${domain}/api/newsletter-form/${formStyles.id}`, {
            method: "POST",
            body: formBody + additionalFields,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((res) => [res.ok, res.json(), res])
            .then(([ok, dataPromise, res]) => {
                if (ok) {
                    resetForm();
                    setFormState(SUCCESS);
                } else {
                    dataPromise.then((data) => {
                        setFormState(ERROR);
                        setErrorMessage(data.message || res.statusText);
                        localStorage.setItem("loops-form-timestamp", "");
                    });
                }
            })
            .catch((error) => {
                setFormState(ERROR);
                // check for cloudflare error
                if (error.message === "Failed to fetch") {
                    setErrorMessage(
                        "Too many signups, please try again in a little while",
                    );
                } else if (error.message) {
                    setErrorMessage(error.message);
                }
                localStorage.setItem("loops-form-timestamp", "");
            });
    };

    const isInline = formStyles.formStyle === "inline";

    function SignUpFormError() {
        return (
            <div>
                <p>
                    {errorMessage ||
                        "Oops! Something went wrong, please try again."}
                </p>
            </div>
        );
    }

    function BackButton() {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <button
                className={styles.button}
                onMouseOut={() => setIsHovered(false)}
                onMouseOver={() => setIsHovered(true)}
                onClick={resetForm}
            >
                &larr; Back
            </button>
        );
    }

    function SignUpFormButton({ props }) {
        return (
            <button className={styles.button} type="submit">
                <span data-visually-hidden>
                    {formState === SUBMITTING
                        ? "Please wait..."
                        : formStyles.buttonText}
                </span>
                subscribe
            </button>
        );
    }

    switch (formState) {
        case SUCCESS:
            return (
                <div
                    className={`${styles.messageBox} + ${styles.messageBoxSuccess}`}
                >
                    <p>{formStyles.successMessage}</p>
                </div>
            );
        case ERROR:
            return (
                <>
                    <div className={styles.messageBox}>
                        <p>
                            <SignUpFormError />
                        </p>
                    </div>
                    <BackButton />
                </>
            );
        default:
            return (
                <>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.inputLabel} htmlFor="email">
                            email
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                className={styles.input}
                                type="text"
                                name="email"
                                placeholder={`mail@3-3.fyi`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                                id="email"
                            />
                            <div
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    left: "-2024px",
                                }}
                            ></div>
                            <SignUpFormButton />
                        </div>
                    </form>
                </>
            );
    }
}
