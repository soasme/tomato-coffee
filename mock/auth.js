module.exports = (req, res, next) => {
  if (req.originalUrl == "/v1/auth/login") {
    res.status(200).json({"url": "http://127.0.0.1:5000/v1/auth/mock"})
  } else if (req.originalUrl == "/v1/auth/mock") {
    res.redirect("http://127.0.0.1:3000/auth/github/callback?state=xxx&code=yyy")
  } else if (req.originalUrl == "/v1/auth/code") {
    res.status(200).json({"token": {"access_token": "xxx"}, "user": {"name": "test"}})
  } else {
    next()
  }
}
