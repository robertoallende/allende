---
title: "Pragmatic Use of GenAI"
description: "Control, iteration, and human judgment in AI-assisted work"
section: "notes"
publishedAt: 2026-01-19
---

There is a gap between what GenAI can do and what it can be trusted to do. These systems produce fluent, authoritative-sounding output regardless of whether that output is accurate, coherent, or fit for purpose. Treating them as answer machines leads to frustration. Treating them as thinking tools—where the human remains responsible for judgment and verification—creates real leverage.

What follows is a set of practical rules for working with GenAI deliberately, followed by the reasoning behind them.

## Working With GenAI

### Context is everything

The quality of what comes out depends entirely on what goes in. Before engaging an LLM on anything substantial, gather the relevant material: notes, sources, data, and a clear sense of constraints—audience, tone, format, and purpose.

This is not preparation for the model’s benefit. It is preparation for yours. Clear, well-organised input produces coherent output. Messy input produces meandering conversations that require constant correction.

Context is how you stay in control.

### Divide and conquer

Asking “write me an article about X” or “draft a strategy for Y” reliably produces generic, shallow results. The model has no idea what matters to you, and you have no way to intervene until the entire artefact is already generated.

A more effective approach is to break work into discrete steps. Start with structure—an outline, a set of questions, or a problem decomposition. Review and refine that before proceeding. Then tackle each section independently, verifying as you go.

Small chunks are easier to evaluate, easier to correct, and easier to shape into something that reflects your actual thinking rather than the model’s defaults. This is how teams avoid shipping confident nonsense faster than they can review it.

### Never trust the math

This is where hallucination becomes dangerous. LLMs perform calculations with complete confidence—and get them wrong. Not occasionally. Regularly.

The safeguard is simple: ask the model to write code that performs the calculation instead of producing the result directly. Run that code yourself. Verify the output with tools you trust. The model’s role is to accelerate setup and exploration, not to be the source of truth.

The same principle applies to any step where correctness matters more than fluency. GenAI should describe procedures and generate candidates—not execute truth-critical operations.

### Verify everything that matters

LLMs hallucinate citations, invent statistics, and assert falsehoods using the same confident tone they use for correct information. This is not a temporary flaw waiting to be fixed in the next version; it is a consequence of how these systems generate language.

Any factual claim that survives into a final deliverable must trace back to a real, independently checked source. The model is useful for exploration and drafting. Responsibility for accuracy remains with the human.

---

## Why This Works

These practices are not arbitrary caution. They reflect something fundamental about what GenAI is—and what it is not.

Used pragmatically, GenAI is a reasoning and iteration tool. It accelerates how humans explore ideas, structure problems, and refine language. It is not an authority, and it is not an autonomous actor. Judgment, responsibility, and final decisions remain unequivocally human.

The value comes from treating GenAI as a **cognitive workbench**. Humans already use conversation as a way of thinking: by externalising rough ideas into language, inspecting them, challenging them, and reshaping them. GenAI extends this process by acting as a fast, language-based interface to a vast body of knowledge.

Breaking work into chunks allows speed without loss of control. Good context reduces drift and wasted cycles. Verification acknowledges that the model generates candidates, not conclusions—and that leverage comes from the feedback loop, not from correctness.

Tool-augmented models make oracle-style interactions possible, but not reliable. Retrieved information can be incomplete, misinterpreted, or incorrectly synthesised. GenAI should be used to generate options and structures. The human evaluates those options, rejects weak ones, refines promising ones, and iterates.

> GenAI is a human-language interface to a large body of knowledge that produces candidate ideas and structures. A human evaluates, constrains, and refines those candidates. Value emerges from the feedback loop, not from treating the system as an authority.

GenAI multiplies whatever operating discipline already exists. Used deliberately, it sharpens thinking, shortens learning loops, and improves decision quality. Used carelessly, it accelerates confusion.

AI is not the differentiator. Judgment is.
