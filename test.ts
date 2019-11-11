
import {Result, match, Err, Ok} from './src/compiled-union'


const log = match<Result<string, string>>({
        Err: string => console.error(Err)
      , Ok: string => console.log(Ok)
    })
