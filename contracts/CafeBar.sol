pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract CafeBar is ERC20("CafeBar", "xCAFE"){
    using SafeMath for uint256;
    IERC20 public cafe;

    constructor(IERC20 _cafe) public {
        cafe = _cafe;
    }

    // Enter the bar. Pay some CAFEs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalCafe = cafe.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalCafe == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalCafe);
            _mint(msg.sender, what);
        }
        cafe.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your CAFEs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(cafe.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        cafe.transfer(msg.sender, what);
    }
}
