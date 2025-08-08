class SampleController {
  getSample(req, res) {
    res.json({ message: "Sample GET route working!" });
  }

  postSample(req, res) {
    res.json({ message: "Sample POST route working!" });
  }
}

module.exports = SampleController;
