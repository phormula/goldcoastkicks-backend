import User from '@app/model/User'

// declare global {
//   namespace Express {
//     export interface Request {
//       // user?: User | null
//     }
//   }
// }
declare global {
  namespace Express {
    interface Request {
      user?: User | null
    }
  }
}
