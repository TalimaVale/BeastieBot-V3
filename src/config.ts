import * as yup from "yup";

interface Config {
  PORT: string;
}

const config = yup.object().shape({
  PORT: yup.number().required()
});

export default <Config>config.validateSync(process.env, { stripUnknown: true });
