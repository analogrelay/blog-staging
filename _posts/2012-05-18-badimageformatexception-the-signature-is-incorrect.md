---
layout: post
title: "BadImageFormatException - The signature is incorrect"
description: ""
category: gotchas
tags: [gotchas]
---
{% include JB/setup %}

Have you ever gotten this exception when running Unit Tests which use Moq?

    System.BadImageFormatException : [D:\Path\To\A.dll] The signature is incorrect.
    
It's a little strange but it turns out the issue is caused by a missing assembly reference in your Unit Test project. Let's say you have three projects: Core, Types and Test. In Types, we define a helper interface for writing to the console:

{% highlight C# %}
public interface IConsole {
    void WriteLine(string line);
}
{% endhighlight%}

In Core, we have code to create and return one:

{% highlight C# %}
public class Thingy {
    public virtual IConsole MakeConsole() { ... }
}
{% endhighlight %}

And in Test, you have a unit test to test that something in Core never even constructs a console. Tests ONLY references Core, not Types (for whatever reason).

{% highlight C# %}
[Fact]
public void DoodadWritesToConsole() {
    // Arrange
    var thingyMock = new MockThingy();
    var doodad = new Doodad(thingyMock.Object);
    
    // Act
    doodad.DoAThing(writeToConsole: false);
    
    // Assert
    thingyMock.Verify(t => t.MakeConsole(), Times.Never());
}
{% endhighlight %}

If you have this set up, you'll get the BadImageFormatException when running the test (or should, I haven't verified this particular set of classes but I mocked it up from the code I actually found this in). The problem is that Test doesn't reference Types, and Types is what provides the interface used as the return value for MakeConsole. All you need to do is add a reference from Test to Types and you're done!

I basically just wanted to throw up a quick blog post so that I could find it if I encountered this again, but hopefully this also helps a few other folks :)