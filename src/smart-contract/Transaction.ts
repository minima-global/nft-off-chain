import { StepOne } from './StepOne'
import { StepTwo } from './StepTwo'

export interface Transaction {
    stepOne: StepOne
    stepTwo?: StepTwo
}
