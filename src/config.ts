import * as yup from "yup";

interface Config {
  PORT: number;
}

const config = yup.object().shape({
  PORT: yup
    .number()
    .integer()
    .required()
});

export default <Config>config.validateSync(process.env, { stripUnknown: true });
