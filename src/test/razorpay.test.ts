import { describe, it, expect } from 'vitest';
import { PLAN_PRICES, ADDON_PRICES } from '../lib/razorpay';

describe('PLAN_PRICES', () => {
  it('has growth, pro, and enterprise plans', () => {
    expect(Object.keys(PLAN_PRICES)).toEqual(['growth', 'pro', 'enterprise']);
  });

  it('each plan has monthly and yearly pricing', () => {
    for (const plan of Object.values(PLAN_PRICES)) {
      expect(plan.monthly).toBeDefined();
      expect(plan.yearly).toBeDefined();
      expect(plan.monthly.amount).toBeGreaterThan(0);
      expect(plan.yearly.amount).toBeGreaterThan(0);
    }
  });

  it('yearly is cheaper per month than monthly', () => {
    for (const [, plan] of Object.entries(PLAN_PRICES)) {
      const monthlyAnnualized = plan.monthly.amount * 12;
      expect(plan.yearly.amount).toBeLessThan(monthlyAnnualized);
    }
  });

  it('prices increase with plan tier', () => {
    expect(PLAN_PRICES.pro.monthly.amount).toBeGreaterThan(PLAN_PRICES.growth.monthly.amount);
    expect(PLAN_PRICES.enterprise.monthly.amount).toBeGreaterThan(PLAN_PRICES.pro.monthly.amount);
  });
});

describe('ADDON_PRICES', () => {
  it('has all expected add-ons', () => {
    const expected = ['extra_rooms', 'whatsapp_pack', 'custom_domain', 'ota_sync', 'priority_support', 'analytics'];
    expect(Object.keys(ADDON_PRICES).sort()).toEqual(expected.sort());
  });

  it('each addon has amount, display, and name', () => {
    for (const addon of Object.values(ADDON_PRICES)) {
      expect(addon.amount).toBeGreaterThan(0);
      expect(addon.display).toBeTruthy();
      expect(addon.name).toBeTruthy();
    }
  });

  it('display strings start with rupee symbol', () => {
    for (const addon of Object.values(ADDON_PRICES)) {
      expect(addon.display).toMatch(/^₹/);
    }
  });
});
