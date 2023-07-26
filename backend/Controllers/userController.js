const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  // Tạp token từ khoá bí mật
  const jwtkey = process.env.JWT_SECRET_KEY;

  // Thiết lập thời gian hết hạn expire là 3 ngày
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};
const registerUser = async (req, res) => {
  try {
    // Lấy các thông tin dữ liệu từ form
    const { name, email, password } = req.body;

    // Thực hiện tìm kiếm user
    let user = await userModel.findOne({ email });

    // Nếu user tồn tại thì trả về
    if (user)
      return res.status(400).json("User with the given email already exist...");

    // Nếu trường dữ liệu nào trống thì phản hồi về
    if (!name || !email || !password)
      return res.status(400).json("All fields are required ...");

    // Kiểm tra định dạng email có hợp lệ hay không
    if (!validator.isEmail(email))
      return res.status(400).json("Email must be a valid email ...");

    // Kiểm tra độ mạnh của mật khẩu
    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be a strong password ...");

    // Khởi tạo đối tượng user mới
    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(10);

    // Gọi hàm mã hoá mật khẩu
    user.password = await bcrypt.hash(user.password, salt);

    // Lưu user
    await user.save();
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
  }
};
const loginUser = async (req, res) => {
  // Lấy dữ liệu từ form
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    // Kiểm tra user có hợp lệ hay chưa
    if (!user) return res.status(400).json("Invalid email or password ...");
    // So sánh mật khẩu của user nhập vào
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json("Invalid email or password");
    // Tạo token
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {}
};
const findUser = async (req, res) => {
  // Lấy ra id của user
  const userId = req.params.userId;
};
module.exports = { registerUser, loginUser };
