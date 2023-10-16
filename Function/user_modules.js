export const authentication = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
      next();
    }
    else {
      res.redirect('/login');
    }
  
  }
  export const UserisLogin = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        res.redirect('/');
    }
    else {
        next();
    }
  
  }
  