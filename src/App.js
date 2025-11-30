import { useEffect, useRef, useState } from 'react';
import './App.css';

const dropdownOptions = [
  { value: 'contrast', label: 'Designing with color contrast' },
  { value: 'keyboard', label: 'Supporting keyboard-only flows' },
  { value: 'aria', label: 'Using landmarks and ARIA labels' },
];

const initialFormState = {
  name: '',
  email: '',
  message: '',
  subscribe: false,
};

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const dropdownButtonRef = useRef(null);
  const dropdownListRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const modalCloseButtonRef = useRef(null);
  const openModalButtonRef = useRef(null);
  const modalHasBeenOpened = useRef(false);

  const selectedOption = dropdownOptions[selectedOptionIndex];

  useEffect(() => {
    if (!isModalOpen) {
      if (modalHasBeenOpened.current) {
        openModalButtonRef.current?.focus();
      }
      return;
    }

    modalHasBeenOpened.current = true;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => {
      modalCloseButtonRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    setHighlightedIndex(selectedOptionIndex);

    const focusTimer = window.setTimeout(() => {
      dropdownListRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [dropdownOpen, selectedOptionIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Please share your name.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'An email address is required.';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Give us a short note so we can help.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setAnnouncement(
        `Thanks ${formData.name || 'there'}! We will send more on ${selectedOption.label.toLowerCase()}.`
      );
      setFormData(initialFormState);
    } else {
      setAnnouncement('Please fix the highlighted fields before submitting.');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleDropdownButtonKeyDown = (event) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      setDropdownOpen(true);
    }
  };

  const handleListKeyDown = (event) => {
    if (!dropdownOpen) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % dropdownOptions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        (prev - 1 + dropdownOptions.length) % dropdownOptions.length
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleOptionSelect(highlightedIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setDropdownOpen(false);
      dropdownButtonRef.current?.focus();
    }
  };

  const handleOptionSelect = (index) => {
    setSelectedOptionIndex(index);
    setDropdownOpen(false);
    dropdownButtonRef.current?.focus();
    setAnnouncement(`Topic set to ${dropdownOptions[index].label}.`);
  };

  const nameFieldId = 'contact-name';
  const emailFieldId = 'contact-email';
  const messageFieldId = 'contact-message';
  const dropdownButtonId = 'topic-button';
  const dropdownListId = 'topic-listbox';

  const activeOptionId = `${dropdownListId}-${dropdownOptions[highlightedIndex]?.value}`;

  return (
    <div className="app-container">
      <header className="intro" aria-labelledby="intro-heading">
        <p className="eyebrow">Inclusive by design</p>
        <h1 id="intro-heading">Build accessible experiences with intention</h1>
        <p>
          Great interfaces are welcoming. They respond to keyboards, announce
          critical state changes, and keep visual contrast readable under any
          lighting conditions.
        </p>
        <p>
          The sections below highlight a contact form, a custom dropdown, and a
          modal dialog that follow WCAG-informed patterns so everyone can get
          their work done.
        </p>
      </header>

      <main className="content">
        <section className="form-section" aria-labelledby="contact-heading">
          <h2 id="contact-heading">Stay in touch</h2>
          <p id="contact-description">
            Tell us how we can help and we will reach out with resources that
            match your goals.
          </p>

          <form
            className="contact-form"
            aria-describedby="contact-description"
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <label htmlFor={nameFieldId}>Full name</label>
              <input
                id={nameFieldId}
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${nameFieldId}-error` : undefined}
              />
              {errors.name && (
                <p id={`${nameFieldId}-error`} className="error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="form-row">
              <label htmlFor={emailFieldId}>Email</label>
              <input
                id={emailFieldId}
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? `${emailFieldId}-error` : undefined
                }
              />
              {errors.email && (
                <p id={`${emailFieldId}-error`} className="error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-row">
              <label htmlFor={messageFieldId}>Message</label>
              <textarea
                id={messageFieldId}
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? `${messageFieldId}-error` : undefined
                }
              />
              {errors.message && (
                <p id={`${messageFieldId}-error`} className="error" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="form-row">
              <label className="dropdown-label" id="topic-label">
                Choose a learning topic
              </label>

              <div
                className="dropdown"
                ref={dropdownContainerRef}
                onKeyDown={handleListKeyDown}
              >
                <button
                  type="button"
                  id={dropdownButtonId}
                  ref={dropdownButtonRef}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  aria-controls={dropdownOpen ? dropdownListId : undefined}
                  aria-labelledby={`${dropdownButtonId} topic-label`}
                  onClick={toggleDropdown}
                  onKeyDown={handleDropdownButtonKeyDown}
                >
                  {selectedOption.label}
                  <span aria-hidden="true" className="dropdown-indicator">
                    ▾
                  </span>
                </button>

                {dropdownOpen && (
                  <ul
                    className="dropdown-list"
                    role="listbox"
                    id={dropdownListId}
                    aria-labelledby="topic-label"
                    aria-activedescendant={activeOptionId}
                    tabIndex={-1}
                    ref={dropdownListRef}
                  >
                    {dropdownOptions.map((option, index) => (
                      <li
                        key={option.value}
                        id={`${dropdownListId}-${option.value}`}
                        role="option"
                        aria-selected={selectedOptionIndex === index}
                        className={
                          index === highlightedIndex ? 'active option' : 'option'
                        }
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleOptionSelect(index)}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-row checkbox-row">
              <input
                id="subscribe-updates"
                type="checkbox"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleInputChange}
              />
              <label htmlFor="subscribe-updates">
                Email me curated accessibility updates each month.
              </label>
            </div>

            <button type="submit" className="primary">
              Send request
            </button>
          </form>
        </section>

        <section className="modal-section" aria-labelledby="modal-demo-heading">
          <h2 id="modal-demo-heading">Custom modal dialog</h2>
          <p>
            Modals should not trap people. This example focuses the first
            interactive element, supports the Escape key, and returns focus to
            the button that launched it.
          </p>

          <button
            type="button"
            className="secondary"
            onClick={() => setModalOpen(true)}
            ref={openModalButtonRef}
          >
            Learn how we plan rollouts
          </button>

          {isModalOpen && (
            <div
              className="modal-backdrop"
              role="presentation"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setModalOpen(false);
                }
              }}
            >
              <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-heading"
                aria-describedby="modal-description"
              >
                <div className="modal-header">
                  <h3 id="modal-heading">Rollout principles</h3>
                  <button
                    ref={modalCloseButtonRef}
                    className="icon-button"
                    type="button"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close dialog"
                  >
                    ×
                  </button>
                </div>
                <p id="modal-description">
                  Ship in small slices, observe real-world feedback, and keep a
                  rollback plan ready. Accessibility fixes deserve the same
                  urgency as security updates.
                </p>
                <p>
                  Before exiting, confirm keyboard navigation, screen reader
                  announcements, and zoomed layouts hold up.
                </p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Sounds good
                  </button>
                  <button
                    type="button"
                    className="primary"
                    onClick={() => setModalOpen(false)}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <div className="sr-announcement" aria-live="polite" role="status">
        {announcement}
      </div>
    </div>
  );
}

export default App;
