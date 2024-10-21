import "../../assets/css/AddPropertyForm.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createRental } from "../../features/rentals/rentalSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { amenityIcons } from "../../utils/amenityIcon";
import {
  propertyInitialValues,
  propertyValidationSchema,
} from "../../utils/formHelper";
import bedTypes from "../../data/bedTypes.json";

const placesLibrary = ["places"];

const generateUniqueId = () => {
  return `id_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
};

export default function AddPropertyForm() {
  const dispatch = useDispatch();
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: placesLibrary,
  });

  const handleSubmit = (values, { resetForm }) => {
    const parsedValues = {
      ...values,
      id: generateUniqueId(), 
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
      price: parseFloat(values.price),
      availablePerson: parseInt(values.availablePerson, 10),
    };
    dispatch(createRental(parsedValues));
    resetForm();
  };

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = (setFieldValue) => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const location = place.geometry.location;

      setFieldValue("address", place.formatted_address);
      setFieldValue("latitude", location.lat());
      setFieldValue("longitude", location.lng());
    }
  };

  const addImageUrl = (setFieldValue, values) => {
    const newImageUrl = "";
    setFieldValue("imageUrl", [...values.imageUrl, newImageUrl]);
  };

  const removeImageUrl = (setFieldValue, index, values) => {
    const updatedImageUrl = values.imageUrl.filter((_, idx) => idx !== index);
    setFieldValue("imageUrl", updatedImageUrl);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={propertyInitialValues}
      validationSchema={propertyValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="form-container">
          <div className="flex flex-col space-y-4">
            {[
              "title",
              "description",
              "city",
              "price",
              "availablePerson",
            ].map((field) => (
              <div className="form-group" key={field}>
                <label htmlFor={field} className="label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <Field className="input" name={field} />
                <ErrorMessage
                  name={field}
                  component="div"
                  className="error-message"
                />
              </div>
            ))}

            <div className="form-group">
              <label htmlFor="bedType" className="label">
                Bed Type
              </label>
              <Field as="select" name="bedType" className="input">
                <option value="">Select a bed type</option>
                {bedTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="bedType"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl" className="label">
                Image URLs
              </label>
              {values.imageUrl.map((imageUrl, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Field
                    className="input"
                    name={`imageUrl[${index}]`}
                    placeholder="Enter image URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(setFieldValue, index, values)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addImageUrl(setFieldValue, values)}
                className="add-button"
              >
                Add Image URL
              </button>
              <ErrorMessage
                name="imageUrl"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="label">
                Address
              </label>
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={() => onPlaceChanged(setFieldValue)}
                options={{
                  componentRestrictions: { country: "PH" },
                  types: ["address"],
                }}
              >
                <Field
                  className="input"
                  name="address"
                  placeholder="Search location"
                />
              </Autocomplete>
              <ErrorMessage
                name="address"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label className="label">Amenities</label>
              <div className="amenities-container">
                {Object.keys(amenityIcons).map((amenity) => {
                  const Icon = amenityIcons[amenity];
                  return (
                    <label key={amenity} className="amenities-label">
                      <Field
                        type="checkbox"
                        name="amenities"
                        value={amenity}
                        className="checkbox"
                        checked={values.amenities.includes(amenity)}
                        style={{ width: 30 }}
                        onChange={() => {
                          const currentAmenities = values.amenities;
                          if (currentAmenities.includes(amenity)) {
                            setFieldValue(
                              "amenities",
                              currentAmenities.filter((a) => a !== amenity)
                            );
                          } else {
                            setFieldValue("amenities", [
                              ...currentAmenities,
                              amenity,
                            ]);
                          }
                        }}
                      />
                      <Icon size={20} />
                      <span style={{ marginLeft: 4 }}>{amenity}</span>
                    </label>
                  );
                })}
              </div>
              <ErrorMessage
                name="amenities"
                component="div"
                className="error-message"
              />
            </div>

            <button type="submit" className="button">
              Create Rental
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
