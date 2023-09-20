import { Command } from "commander";

const program = new Command()

program.option('--mode <mode>', 'modo de trabajo', 'DEVELOPMENT')
    .option('--service <service>', 'modelo de persistencia', 'MONGO')

program.parse()


export default program