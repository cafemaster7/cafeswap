const { expectRevert } = require('@openzeppelin/test-helpers');
const CafeToken = artifacts.require('CafeToken');

contract('CafeToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.cafe = await CafeToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.cafe.name();
        const symbol = await this.cafe.symbol();
        const decimals = await this.cafe.decimals();
        assert.equal(name.valueOf(), 'CafeToken');
        assert.equal(symbol.valueOf(), 'CAFE');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.cafe.mint(alice, '100', { from: alice });
        await this.cafe.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.cafe.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.cafe.totalSupply();
        const aliceBal = await this.cafe.balanceOf(alice);
        const bobBal = await this.cafe.balanceOf(bob);
        const carolBal = await this.cafe.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.cafe.mint(alice, '100', { from: alice });
        await this.cafe.mint(bob, '1000', { from: alice });
        await this.cafe.transfer(carol, '10', { from: alice });
        await this.cafe.transfer(carol, '100', { from: bob });
        const totalSupply = await this.cafe.totalSupply();
        const aliceBal = await this.cafe.balanceOf(alice);
        const bobBal = await this.cafe.balanceOf(bob);
        const carolBal = await this.cafe.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.cafe.mint(alice, '100', { from: alice });
        await expectRevert(
            this.cafe.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.cafe.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
