import { useState } from "react";

export default function ComplaintForm({
  onSubmit
}) {

  const [formData, setFormData] =
    useState({

      citizen_name: "",

      mobile_number: "",

      district: "Lucknow",

      pincode: "",

      selected_department: "Other",

      language: "Hindi",

      problem_title: "",

      description: ""
    });

  function handleChange(event) {

    const { name, value } =
      event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(event) {

    event.preventDefault();

    onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card slide-up"
    >

      <div className="mb-6">

        <h2 className="section-title">
          Citizen Grievance Portal
        </h2>

        <p className="text-gray-500">
          Submit civic complaints in Hindi,
          English, or Hinglish
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          type="text"
          name="citizen_name"
          placeholder="Full Name"
          className="input-field"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="mobile_number"
          placeholder="Mobile Number"
          className="input-field"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="district"
          placeholder="District"
          className="input-field"
          onChange={handleChange}
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          className="input-field"
          onChange={handleChange}
          required
        />

        <select
          name="selected_department"
          className="input-field"
          onChange={handleChange}
        >

          <option>
            Other
          </option>

          <option>
            Water Supply
          </option>

          <option>
            Electricity
          </option>

          <option>
            Road Repair
          </option>

          <option>
            Sanitation
          </option>

          <option>
            Public Safety
          </option>

          <option>
            Property Tax
          </option>

        </select>

        <select
          name="language"
          className="input-field"
          onChange={handleChange}
        >

          <option>
            Hindi
          </option>

          <option>
            English
          </option>

          <option>
            Hinglish
          </option>

        </select>

      </div>

      <div className="mt-5">

        <input
          type="text"
          name="problem_title"
          placeholder="Problem Title"
          className="input-field"
          onChange={handleChange}
          required
        />

      </div>

      <div className="mt-5">

        <textarea
          rows="6"
          name="description"
          placeholder="Describe your grievance..."
          className="input-field resize-none"
          onChange={handleChange}
          required
        />

      </div>

      <button
        type="submit"
        className="primary-btn mt-6 w-full"
      >
        Submit Grievance
      </button>

    </form>
  );
}