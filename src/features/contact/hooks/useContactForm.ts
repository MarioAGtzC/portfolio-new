import { useCallback, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { toast } from 'react-toastify';

const SUBMIT_COOLDOWN_MS = 30000;

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type ContactFormField = keyof ContactFormState;

const INITIAL_FORM_STATE: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL;

function normalizeFormState(formState: ContactFormState): ContactFormState {
  return {
    name: formState.name.trim(),
    email: formState.email.trim(),
    phone: formState.phone.trim(),
    subject: formState.subject.trim(),
    message: formState.message.trim(),
  };
}

function validateFormState(formState: ContactFormState) {
  const normalizedState = normalizeFormState(formState);

  const requiredFields: Array<keyof ContactFormState> = [
    'name',
    'email',
    'subject',
    'message',
  ];

  const missingField = requiredFields.find(
    (field) => !normalizedState[field].length,
  );

  if (missingField) {
    toast.error('Please fill in the required fields before submitting.');
    return null;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(normalizedState.email)) {
    toast.error('Enter a valid email address.');
    return null;
  }

  return normalizedState;
}

function useContactForm() {
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Decoy field: only bots fill this in, real users never see it.
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [lastSubmit, setLastSubmit] = useState(0);

  const handleHoneypotChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setHoneypot(event.target.value);
    },
    [],
  );

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpireOrError = useCallback(() => {
    setTurnstileToken('');
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      const field = name as ContactFormField;
      if (!(field in INITIAL_FORM_STATE)) {
        return;
      }

      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (honeypot) {
        toast.success("Thanks! I'll get back to you as soon as possible.");
        setFormState(INITIAL_FORM_STATE);
        return;
      }

      if (!CONTACT_API_URL) {
        console.error('VITE_CONTACT_API_URL is not configured.');
        toast.error('Something went wrong. Please try again later.');
        return;
      }

      const normalizedFormState = validateFormState(formState);

      if (!normalizedFormState) {
        return;
      }

      if (!turnstileToken) {
        toast.error('Please complete the verification before sending.');
        return;
      }

      if (Date.now() - lastSubmit < SUBMIT_COOLDOWN_MS) {
        toast.error('Please wait a moment before sending another message.');
        return;
      }

      setLastSubmit(Date.now());
      setIsSubmitting(true);

      try {
        const response = await fetch(CONTACT_API_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...normalizedFormState, turnstileToken }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        toast.success("Thanks! I'll get back to you as soon as possible.");
        setFormState(INITIAL_FORM_STATE);
        setTurnstileToken('');
      } catch (error) {
        console.error('Error sending contact message', error);
        toast.error('Something went wrong. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, honeypot, turnstileToken, lastSubmit],
  );

  return {
    formState,
    isSubmitting,
    honeypot,
    handleChange,
    handleHoneypotChange,
    handleTurnstileSuccess,
    handleTurnstileExpireOrError,
    handleSubmit,
  };
}

export default useContactForm;
