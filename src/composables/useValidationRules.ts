export default function () {
  return {
    required: (value: unknown) => !!value || "Field is required",

    defined: (value: unknown) => (typeof value !== "undefined" && value !== null) || "Field is required",

    minLength: (value: unknown, length: number) => String(value).length >= length || `Minimum characters is ${length}`,

    maxLength: (value: unknown, length: number) => String(value).length <= length || `Maximum characters is ${length}`,

    email: (value: string) =>
      !value || /^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+(\.\w{2,3})+$/.test(value) || "Must be a valid email",

    domain: (value: string) =>
      !value ||
      /^((?!-)[a-z0–9-]{1,63}(?<!-)\.)+([a-z0-9]{2,12}(?<![-0-9]))$/.test(value.toLowerCase()) ||
      "Must be a valid domain",

    telephone: (value: string) => !value || /^([0-9\\-])*$/.test(value) || "Must be a valid phone number",

    decimal: (value: unknown, decimalPlace = 2, checkOverDecimalOnly = true) => {
      const regex = new RegExp(
        `^(0|[1-9]\\d*)((\\.)${checkOverDecimalOnly ? "?" : ""}\\d{${
          checkOverDecimalOnly ? "0," : ""
        }${decimalPlace}})$`
      );
      if (value && !value.toString().replace(/\s/g, "").match(regex)) {
        return `Must be a valid decimal with ${decimalPlace} fraction`;
      }
      return true;
    },

    lessThan: (value: string, target: string) =>
      !value || !target || parseFloat(value) < parseFloat(target) || `Must be less than ${target}`,

    equalOrGreaterThan: (value: string, target: string) =>
      !value || !target || parseFloat(value) >= parseFloat(target) || `Must be ${target} or greater`,

    greaterThan: (value: string, target: string) =>
      !value || !target || parseFloat(value) > parseFloat(target) || `Must be greater than ${target}`,

    integer: (value: string | number) => Number.isInteger(Number(value)) || "Must be a valid integer",

    beforeEpoch: (value: string | number, target: string | number) =>
      !value || !target || parseInt(String(value)) < parseInt(String(target)) || `Must be before ${target}`,

    afterEpoch: (value: string | number, target: string | number) =>
      !value || !target || parseInt(String(value)) > parseInt(String(target)) || `Must be after ${target}`,

    is: (value: string | number, target: string | number) =>
      !value || !target || parseInt(String(value)) === parseInt(String(target)) || `Must be ${target}`,
  };
}
