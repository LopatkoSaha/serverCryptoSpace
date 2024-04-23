/* tslint:disable:max-classes-per-file */
export class TokenExpiredError extends Error {
    public errName = "TokenExpiredError";

}
export class JsonWebTokenError extends Error {
    public errName = "JsonWebTokenError";
}
export class RegistrationError extends Error {
    public errName = "RegistrationError";
}
export class LoginError extends Error {
    public errName = "LoginError";
}
export class ValidationError extends Error {
    public errName = "ValidationError";
}
export class BuyCurrencyError extends Error {
    public errName = "BuyCurrencyError";
}
export class BuyAllInError extends Error {
    public errName = "BuyAllInError";
}
export class ActualCoinsError extends Error {
    public errName = "ActualCoinsError";
}
export class DataPortfolioError extends Error {
    public errName = "DataPortfolioError";
}
export class StatisticsCursError extends Error {
    public errName = "StatisticsCursError";
}
export class WhoAmIError extends Error {
    public errName = "WhoAmIError";
}
