import UserRepository from "../repository/UserRepository.ts";


class AuthService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

}

export default AuthService;