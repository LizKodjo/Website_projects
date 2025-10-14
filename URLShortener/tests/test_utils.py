import pytest
from app import generate_short_code
from unittest.mock import patch


def test_generate_short_code_default_length():
    """Test short code generation with default length"""
    code = generate_short_code()

    # Should be 6 characters by default
    assert len(code) == 6

    # Should contain only letters and digits
    assert code.isalnum()

    # Should be uppercase and lowercase letters, no spaces or special chars
    assert all(c.isalnum() for c in code)


def test_generate_short_code_custom_length():
    """Test short code generation with custom length"""
    for length in [4, 8, 12]:
        code = generate_short_code(length)
        assert len(code) == length
        assert code.isalnum()


def test_generate_short_code_uniqueness():
    """Test that generated codes are likely to be unique"""
    codes = set()
    for _ in range(100):  # Generate 100 codes
        code = generate_short_code()
        codes.add(code)

    # With 6 characters (62 possibilities each), collisions should be very rare
    assert len(codes) == 100  # All codes should be unique


def test_generate_short_code_characters():
    """Test that codes use the correct character set"""
    code = generate_short_code(100)  # Long code to test character distribution
    assert any(c.islower() for c in code)  # Contains lowercase
    assert any(c.isupper() for c in code)  # Contains uppercase
    assert any(c.isdigit() for c in code)  # Contains digits
    assert not any(not c.isalnum() for c in code)  # No special characters


@patch('app.random.choice')
def test_generate_short_code_randomness(mock_choice):
    """Test that random.choice is used for code generation"""
    mock_choice.return_value = 'a'
    code = generate_short_code(6)

    assert code == 'aaaaaa'
    assert mock_choice.call_count == 6
